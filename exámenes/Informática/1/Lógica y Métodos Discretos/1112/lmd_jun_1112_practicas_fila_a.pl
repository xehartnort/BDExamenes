threerec(N,F,_,_,N,F) :- !.
threerec(N1,F1,F2,F3,N,F) :- N1 < N,
	                     N2 is N1+1,
			     F4 is F3-2*F2+F1,
			     threerec(N2,F2,F3,F4,N,F).

fastrec(N,F) :- threerec(0,2,3,1,N,F).