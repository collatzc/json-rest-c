@echo off
SET CURRENTDIR="%cd%"
docker run -it --name json-rest-c -v %CURRENTDIR%:/json-rest-c -w /json-rest-c node bash