from . core import MainGEEApi
from django.conf import settings
from django.http import JsonResponse
from datetime import date, datetime
import ee, json, os, time
from ee.ee_exception import EEException
from django.views.decorators.csrf import csrf_exempt
ee.Initialize()

def is_ajax(request):
    return request.META.get('HTTP_X_REQUESTED_WITH') == 'XMLHttpRequest'

# Get date list
def nowcastDateList(request):
    if is_ajax (request=request) and (request.method == "GET"):
        #core = MainGEEApi(date)
        core = MainGEEApi()
        data = core.getNowcastDateList()
        return JsonResponse(data, safe=False)

# def forecastDateList(request):
#     if is_ajax (request=request) and (request.method == "GET"):
#         #core = MainGEEApi(date)
#         core = MainGEEApi()
#         data = core.getForecastDateList()
#         return JsonResponse(data, safe=False)

@csrf_exempt
def get_lhasa_map(request):
    if is_ajax (request=request) and (request.method == "GET"): 
        date_nowcast = request.GET.get('selected_date_nowcast')
        model = request.GET.get('selected_model')
        date_forecast = request.GET.get('selected_date_forecast')
        core = MainGEEApi()
        data = core.getLHASALayer(model, date_nowcast, date_forecast)
        return JsonResponse(data, safe=False)

# Get precipitation map
@csrf_exempt
def get_precipitation_map(request):
    if is_ajax (request=request) and (request.method == "GET"): 
        date = request.GET.get('selected_date_precip')
        cmap = request.GET.get('cmap')
        accum = request.GET.get('accum')
        core = MainGEEApi()
        data = core.getPrecipMap(date, accumulation=accum, cmap_name=cmap)
        return JsonResponse(data, safe=False)