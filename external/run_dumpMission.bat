::var child = spawn('java', ['-cp', 'java-json.jar:.', 'PlutoMake', 'tests/android.png']);
@echo off
@echo Starting dumpMission...
java -classpath OneWireAPI.jar;%classpath% dumpMission %1 %2

