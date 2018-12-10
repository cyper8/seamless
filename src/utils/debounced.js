export function Debounced(func,backoff) {
	var timer;
	return function(){
		var self = this;
		var evtargs = arguments;
		if (timer){
			clearTimeout(timer);
			timer = undefined;
		}
		timer = setTimeout(function(){
			clearTimeout(timer);
			timer = undefined;
			(func||(function(){})).apply(self,evtargs);
		},backoff||0);
	};
}
