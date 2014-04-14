for rec in newData:
	if not rec['classifier'] in chartload.keys():
		chartload[rec['classifier']] = {}
	if rec['variable'] in chartload[rec['classifier']].keys():
		tmp_arr = chartload[rec['classifier']][rec['variable']]
		tmp_arr.append(rec['value'])
	else:
		chartload[rec['classifier']]
		[rec['variable']] = [rec['value']]
	
