from django.shortcuts import render
from django.views.generic import TemplateView

class HomePage(TemplateView):
    template_name = "home.html"

class MapPage(TemplateView):
    template_name = "map.html"
