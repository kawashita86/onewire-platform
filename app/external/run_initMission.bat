@echo off
@echo Starting initMission...
java -classpath OneWireAPI.jar;%classpath% initMissionWithAddress %1 %2