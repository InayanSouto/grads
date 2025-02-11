*Purpose: College of DuPage Models Product Shell
*Author: Gensini, Winter 2015
*************************************************************************
*always run this function to get model arguments and plotting defaults
function main(args)
 modinit=subwrd(args,1)
 modname=subwrd(args,2)
 fhour=subwrd(args,3)
 sector=subwrd(args,4)
 runtime=subwrd(args,5)
 'run /home/scripts/grads/functions/pltdefaults.gs'
*GLOBAL VARIABLES
filext = '.png'
txtext = '.txt'
basedir = '/home/apache/servername/data/forecast'
*************************************************************************
*open the GrADS .ctl file made in the prodrunner script
ctlext = '.ctl'
'open /home/scripts/grads/grads_ctl/'modname'/'modinit''modname%ctlext
if modname = NAMAK
 modname = NAM
endif
if modname = GFS | modname = GEM
 'set t 'fhour/3+1
else
 'set t 'fhour+1
endif
*get some time parameters
'run /home/scripts/grads/functions/timelabel.gs 'modinit' 'modname' 'fhour
*set domain based on sector input argument
'run /home/scripts/grads/functions/sectors.gs 'sector' 'modname
*'run /home/scripts/grads/colorbars/color.gs -levs -10 -9 -8 -7 -6 -5 -4 -3 -2 -1 -.5 -.25 0 .25 .5 1 2 3 4 5 6 7 8 9 10 -kind blue->white->red'
'set gxout shade2'
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title

'draw string 0.1 8.3 `4850mb Deformation | College of DuPage NEXLAB'

*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _850_defo_ fhour
filename = basedir'/'modname'/'runtime'/'sector'/'prodname%filext
level = 850
'set lev 'level
'run /home/scripts/grads/functions/dynamic.gs'
'set gxout barb'
'set rgb 99 5 5 5'
'set ccolor 99'
'set cthick 1'
'set digsize 0.05'
'd def1;def2'
'run /home/scripts/grads/functions/counties.gs 'sector
'set cint 30'
'run /home/scripts/grads/functions/isoheights.gs 'level
*'run /home/scripts/grads/functions/windbarb.gs 'sector' 'modname' 'level
'run /home/scripts/grads/functions/states.gs 'sector
 
************************
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
