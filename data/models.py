from django.db import models

class Rack(models.Model):
    id = models.AutoField(primary_key=True)
    online = models.BooleanField()
    description = models.CharField(max_length=255)
    nice_name = models.CharField(max_length=255)

    latitude = models.FloatField()
    longtitude = models.FloatField()

    rack_size = models.SmallIntegerField()

class RackInfo(models.Model):
    rack = models.ForeignKey(Rack)
    queried = models.DateTimeField(auto_now_add=True)
    ready_bikes = models.SmallIntegerField()
    empty_locks = models.SmallIntegerField()
