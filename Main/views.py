from django.shortcuts import *

# Create your views here.
def main(request):
    return render_to_response('index.html', RequestContext(request))