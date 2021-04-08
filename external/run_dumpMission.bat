::var child = spawn('java', ['-cp', 'java-json.jar:.', 'PlutoMake', 'tests/android.png']);
@echo off
@echo Starting dumpMission...
java -classpath OneWireAPI.jar;%classpath% dumpMissionWithAddress %1 %2

