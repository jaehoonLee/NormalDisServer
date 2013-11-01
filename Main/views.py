from django.shortcuts import *

# Create your views here.
def main(request):
    loop = [1, 2, 3]
    return render_to_response('test.html', RequestContext(request, {'loops' : loop}))
    #return render_to_response('index.html', RequestContext(request, {'loops' : loop}))