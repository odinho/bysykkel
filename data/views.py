import urllib2

from models import Rack, RackInfo

def update(request):
    racks = urllib2.urlopen('http://smartbikeportal.clearchannel.no/public/mobapp/maq.asmx/getRacks').read()

    print racks



