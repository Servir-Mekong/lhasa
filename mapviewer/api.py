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

@csrf_exempt
def get_lhasa_map(request):
    if is_ajax (request=request) and (request.method == "GET"): 
        date = request.GET.get('selected_date')
        core = MainGEEApi()
        data = core.getLHASALayer(date)
        return JsonResponse(data, safe=False)