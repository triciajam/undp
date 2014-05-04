chartload = {}
for rec in newData:
	if not rec['classifier'] in chartload.keys():
		chartload[rec['classifier']] = {}
		print "adding " + rec['classifier']
	if rec['variable'] in chartload[rec['classifier']].keys():
		print "adding to array " + rec['classifier']
		tmp_arr = chartload[rec['classifier']][rec['variable']]
		tmp_arr.append(rec['value'])
	else:
		print "starting new array " + str(rec['variable'])
		chartload[rec['classifier']][rec['variable']] = [rec['value']]
	
