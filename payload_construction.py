

prepayload = {}
for x in workingfields:
	print x['ccode']
	print x['ccode'] in prepayload.keys()
	if x['ccode'] in prepayload.keys():
		prepayload[x['ccode']]['timedata'].append({'year':x['year'],'rev_resrevgdp':x['rev_resrevgdp'],'normalized_total_prod':x['normalized_total_prod'],'max_rent':x['max_rent'],'gov_take':x['gov_take']})
	else:
		prepayload[x['ccode']] = {'class_income':x['class_income'],'coef':x['coef'],'datapoints':x['datapoints'],'classifier':x['classifier'],'class_reg':x['class_reg'],'timedata':[{'year':x['year'],'rev_resrevgdp':x['rev_resrevgdp'],'normalized_total_prod':x['normalized_total_prod'],'max_rent':x['max_rent'],'gov_take':x['gov_take']}]}



def getKey(coef):
	coef = float(coef)
	if coef < -.7946:
		return "Extremely Regressive (below -0.79)"
	if coef > -.7945 and coef < -.6782:
		return "Regressive (-0.79 to -0.68)"
	if coef > -.6781 and coef < -.459:
		return "Potentially Regressive (-0.68 to -0.46)"
	if coef > -.459 and coef < -.1677:
		return "Neutral (-0.46 to -0.17)"
	if coef > -.1677 and coef < .947:
		return "Potentially Progressive (-0.167 to .95)"
	if coef > .9469:
		return "Progresive (.95 and up)"

for k in fullcountries.keys():
	try:
		print prepayload[k]['classifier']
		prepayload[k]['name'] = fullcountries[k]
		prepayload[k]['fillKey'] = getKey(prepayload[k]['coef'])
	except:
		prepayload[k] = {'name':fullcountries[k],'fillKey':'missingData'}


def getKey(coef):
	if coef < -.7946:
		return '0'
	if coef > -.7945 and coef < -.6782:
		return '1'
	if coef > -.6781 and coef < -.459:
		return '2'
	if coef > -.459 and coef < -.1677:
		return '3'
	if coef > -.1677 and coef < .947:
		return '4'
	if coef > .9469:
		return '5'



"""
quantile(as.numeric(levels(working_fields$coef)),probs=seq(0,1,(1/5)))
        0%        20%        40%        60%        80%       100% 
-0.9913637 -0.7946475 -0.6782864 -0.4590857 -0.1677854  0.9477114 
"""