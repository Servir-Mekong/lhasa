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
# /////////////////////////////////////////////
ee.Initialize()

class MainGEEApi():

    # ===================== Create Tile Layer URL ===================== */

    def getTileLayerUrl(self, ee_image_object):
        map_id = ee.Image(ee_image_object).getMapId()
        tile_url_template = str(map_id['tile_fetcher'].url_format)
        return tile_url_template
    
    # =========================== Get EE Layer =============================== */
    def getLHASALayer(self, date):
        date = date
        ic = ee.ImageCollection("projects/servir-mekong/LHASA/hazard")
        filteredImage = ic.filter(ee.Filter.eq('system:index', ('hazard_'+date))).first()
        maskedImage = filteredImage.selfMask()
        tileMap = self.getTileLayerUrl(maskedImage.visualize(palette=['white', 'orange', 'red', 'purple'], min=0, max=0.5))
        return tileMap
