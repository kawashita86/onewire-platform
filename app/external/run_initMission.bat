@echo off
@echo Starting initMission...
java -classpath OneWireAPI.jar;%classpath% initMission %1 %2