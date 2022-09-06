import time
import os
import json
import ee
from datetime import datetime, timedelta, date
from ee.ee_exception import EEException
from django.http import JsonResponse
from django.conf import settings
from django.core import serializers
from django.http import HttpResponse
import matplotlib.pyplot as plt
import numpy as np
import base64
import matplotlib as mpl
mpl.use('Agg')
mpl.rcParams.update({'font.size': 14})
# /////////////////////////////////////////////
ee.Initialize()

class MainGEEApi():

    def getNowcastDateList(self):
        pickup_dict = {}
        def imgDate(d):
            return ee.Date(d).format("YYYY-MM-dd")
        ImageCollection = ee.ImageCollection("projects/servir-mekong/LHASA/hazard")
        dates = ee.List(ImageCollection.aggregate_array("system:time_start")).map(imgDate).getInfo()
        return dates

    # def getForecastDateList(self):
    #     pickup_dict = {}
    #     def imgDate(d):
    #         return ee.Date(d).format("YYYY-MM-dd")
    #     ImageCollection = ee.ImageCollection("projects/servir-mekong/LHASA/hazardProb")
    #     forecast_dates = ee.List(ImageCollection.aggregate_array("system:time_start")).map(imgDate).getInfo()
    #     return forecast_dates

    # ===================== Create Tile Layer URL ===================== */

    def getTileLayerUrl(self, ee_image_object):
        map_id = ee.Image(ee_image_object).getMapId()
        tile_url_template = str(map_id['tile_fetcher'].url_format)
        return tile_url_template
    
    # =========================== Get EE Layer =============================== */
    def getLHASALayer(self, model, date_nowcast, date_forcast):
        date_nowcast = date_nowcast
        date_forcast = date_forcast
        model = model
        roi = ee.FeatureCollection("projects/servir-mekong/Boundary/mekong_region")
        if model == "nowcast":
            ic = ee.ImageCollection("projects/servir-mekong/LHASA/hazard")
            img = ic.filter(ee.Filter.eq('system:index', ('hazard_'+date_nowcast)))
            img = img.first()
            img = img.clip(roi)
            maskedImage = img #.selfMask()
            tileMap = self.getTileLayerUrl(maskedImage.visualize(palette=['white', 'orange', 'red', 'purple'], min=0, max=0.5))
            return tileMap
        elif model =="forecast":
            ic = ee.ImageCollection("projects/servir-mekong/LHASA/hazardProb")
            img = ic.filter(ee.Filter.eq('system:index', ('hazardProb_'+date_forcast)))
            img = img.first()
            img = img.clip(roi)
            maskedImage = img #.selfMask()
            tileMap = self.getTileLayerUrl(maskedImage.visualize(palette=['white', 'orange', 'red', 'purple'], min=0, max=0.5))
            return tileMap

    # Get precipitation map
    def getPrecipMap(self, date, accumulation=1, cmap_name='nipy_spectral'):
        def _accumulate(ic, date, ndays=1):
            eeDate = ee.Date(date)
            ic_filtered = ic.filterDate(
                eeDate.advance(-(ndays-1), 'day'), eeDate.advance(1, 'day'))
            accum_img = ee.Image(ic_filtered.sum())
            return accum_img.mask(accum_img.gt(1))

        if int(accumulation) not in [1, 3, 7]:
            raise NotImplementedError(
                'Selected accumulation value is not yet implemented, options are: 1, 3, 7')
        roi = ee.FeatureCollection("projects/servir-mekong/Boundary/mekong_region")
        ic = ee.ImageCollection(
            'JAXA/GPM_L3/GSMaP/v6/operational').select(['hourlyPrecipRateGC']).clip(roi)

        ranges = {1: [1, 100], 3: [1, 250], 7: [1, 500]}
        crange = ranges[int(accumulation)]

        accum = _accumulate(ic, date, int(accumulation))
        nBands = len(accum.bandNames().getInfo())
        test = nBands > 0

        cmap = mpl.cm.get_cmap(cmap_name, 100)

        hexcodes = []
        for i in range(cmap.N):
            # will return rgba, we take only first 3 so we get rgb
            rgb = cmap(i)[:3]
            hexcodes.append(mpl.colors.rgb2hex(rgb))
        colormap = ','.join(hexcodes)
        if test:
            precipMap = self.getTileLayerUrl(accum.visualize(
                min=crange[0], max=crange[1], palette=hexcodes))
        else:
            precipMap = ''

        return precipMap

