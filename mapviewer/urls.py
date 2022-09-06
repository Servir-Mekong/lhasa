from django.urls import path
from . import views, api
from django.urls import include, re_path

urlpatterns = [
    path('', views.HomePage.as_view(), name='home'),
    path('map/', views.MapPage.as_view(), name='map'),
    re_path(r'^ajax/lhasamap/$', api.get_lhasa_map),
    re_path(r'^ajax/nowcastdate/$', api.nowcastDateList),
    # re_path(r'^ajax/forecastdate/$', api.forecastDateList),
    re_path(r'^ajax/precipmap/$', api.get_precipitation_map),
]
