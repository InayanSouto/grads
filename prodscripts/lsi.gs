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
if modname = GFS | modname = NAM | modname = GEM
 'set t 'fhour/3+1
else
 'set t 'fhour+1
endif
*get some time parameters
'run /home/scripts/grads/functions/timelabel.gs 'modinit' 'modname' 'fhour
*set domain based on sector input argument
'run /home/scripts/grads/functions/sectors.gs 'sector' 'modname
'run /home/scripts/grads/colorbars/color.gs -5 15 1 -kind red-(5)->white-(4)->blue->magenta'
'set gxout shade2'
*START: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*give the image a product title
'draw string 0.1 8.3 Lid Strength Index (`3.`4C) | College of DuPage NEXLAB'
't = TMP2m'
'tc=(t-273.16)'
'rh = RH2m'
if modname = RAP
 'td=tc-( (14.55+0.114*tc)*(1-0.01*rh) + pow((2.5+0.007*tc)*(1-0.01*rh),3) + (15.9+0.117*tc)*pow((1-0.01*rh),14) )'
else
 'td=DPT2m-273.16'
endif
'define vapr= 6.112*exp((17.67*td)/(td+243.5))'
'define e= vapr*1.001+(lev-100)/900*0.0034'
'define mixr= 0.62197*(e/(lev-e))*1000'
'define dwpk= td+273.16'
'undefine td'
'define tlcl= 1/(1/(dwpk-56)+log(t/dwpk)/800)+56'
'undefine e'
'define theta=t*pow(1000/lev,0.286)'
'define sfthte=theta*exp((3.376/tlcl-0.00254)*mixr*1.0+0.00081*mixr)'
'define sfthtw = 45.674 - 52.091 * pow(273.15/sfthte,3.504)'
'undefine sfthte'
'undefine vapr'
'undefine dwpk'
'undefine theta'
'undefine tlcl'
level = 1000
while level >= 500
 'set lev 'level
 't = TMPprs'
 'tc=(t-273.16)'
 'td=tc'
 'define vapr= 6.112*exp((17.67*td)/(td+243.5))'
 'define e= vapr*1.001+(lev-100)/900*0.0034'
 'define mixr= 0.62197*(e/(lev-e))*1000'
 'define dwpk= td+273.16'
 'undefine td'
 'define tlcl= 1/(1/(dwpk-56)+log(t/dwpk)/800)+56'
 'undefine e'
 'define theta=t*pow(1000/lev,0.286)'
 'define thte=theta*exp((3.376/Tlcl-0.00254)*mixr*1.0+0.00081*mixr)'
 'define thtw = 45.674 - 52.091 * pow(273.15/thte,3.504)'
 if thtw >= thtw
  'define finmaxw = thtw'
 endif
 level = level - 25
endwhile
'define lsi = finmaxw - sfthtw'
'd lsi'
'set gxout contour'
'set cthick 8'
'set cstyle 1'
'set clevs -1 0 2 4'
'set rgb 996 255 179 102'
'set rgb 997 255 0 0'
'set rgb 997 255 0 0'
'set rgb 998 255 255 0'
'set rgb 999 102 255 102'
'set ccols 997 996 998 999'
'd lsi'
*give the product a name between sector and fhour variables and combo into filename variables
prodname = modname sector _con_lsi_ fhour
filename = basedir'/'modname'/'runtime'/'sector'/'prodname%filext
level = surface
'run /home/scripts/grads/functions/counties.gs 'sector
'run /home/scripts/grads/functions/windbarb.gs 'sector' 'modname' 'level
'run /home/scripts/grads/functions/states.gs 'sector
*start_readout
if modname = GFS | modname = NAM | modname = RAP
 'set gxout print'
 'run /home/scripts/grads/functions/readout.gs 'modname' 'sector
 'd lsi'
 dummy=write(basedir'/'modname'/'runtime'/'sector'/readout/'prodname%txtext,result)
endif
*end_readout
*END: PRODUCT SPECIFIC ACTIONS~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
*plot the colorbar on the image
'run /home/scripts/grads/functions/pltcolorbar.gs -ft 1 -fy 0.33 -line on -fskip 2 -fh .1 -fw .1 -lc 99 -edge triangle -fc 99'
*generate the image
'run /home/scripts/grads/functions/make_image.gs 'filename
