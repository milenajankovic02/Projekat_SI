import networkx as nx
import matplotlib.pyplot as plt
from networkx.algorithms.planarity import is_planar
import sys

'''
zad1. Mario se nalazi na pravougaonom terenu koji je izdijeljen na jedinične kvadratiće i želi stići do kraljice. 
U svakom trenutku, Mario može preći u neko od 8 susjednih polja. Međutim, na nekim poljima (onim sa pozitivnim vrijednostima) 
nalaze se zli čarobnjaci koji naplaćuju prelaz preko polja. Kada Mario dodje u neko polje sa zlim čarobnjakom, on plaća cijenu 
jednaku vrijednosti koju to polje ima. Neka polja predstavljaju zid i kroz njih nije moguće proći. Osim toga, Mario ima čekić kojim 
može srušiti tačno jedan zid u nekom polju i nakon toga čekić je neupotrebljiv. Nakon rušenja zida, Mario može preći u ovo polje pri 
čemu ne plaća ništa za taj korak. Odredite minimalnu cijenu koju Mario mora platiti da dođe do kraljice.
Ulaz: Na ulazu su dati brojevi M i N, odnosno dimenzije pravougaonog terena, tj. broj redova i broj kolona respektivno. Zatim slijedi 
MxN brojeva koji predstavljaju polja terena. Polje u kome se nalazi Mario označeno je sa 0, polje u kome je kraljica sa -1, a polje u 
kome je zid sa -2. Polja u kojima su zli čarobnjaci su označena pozitivnim cijelim brojevima. Garantuje se da se na terenu nalazi tačno 
jedno polje sa brojem 0 i tačno jedno polje sa brojem -1. Polja označenih sa -2 može biti 0 ili više.
Izlaz: Štampati minimalnu cijenu potrebnu da Mario dodje do kraljice ili poruku NEMOGUCE ako to nije moguće.
Primjer:
Ulaz:	
3 4
0 3 2 1
2 5 -2 -2
-2 -2 -1 3	
Izlaz:
2
Objašnjenje: Mario može preći u polje ispod (cijena 2), potom srušiti zid na poziciji (3,2), preći u to polje i, konačno, stići do kraljice.
'''
   
n, m = map(int, input().split())
matrica = []
for _ in range(n):
    red = input().strip()
    matrica.append(list(map(int, red.split())))

g = nx.DiGraph()
for i in range(n):
    for j in range(m):
        if matrica[i][j] == 0:
            start = (i, j)
        if matrica[i][j] == -1:
            end = (i, j)
        g.add_node((i, j)) #dodamo cvorove

dx = [1, -1, 0, 1, -1, 0, 1, -1]
dy = [1, 1, 1, -1, -1, -1, 0, 0]

#dodavanje grana gdje moze
for i in range(n):
    for j in range(m):
        if matrica[i][j] != -2:
            for k in range(8):
                x = dx[k] + i
                y = dy[k] + j
                if 0 <= x < n and 0 <= y < m and matrica[x][y] != -2:
                    g.add_edge((i, j), (x, y), weight = max(0, matrica[x][y])) #dodamo granu ako mat[x][y] nije zid
try:
    path = nx.shortest_path(g, source=start, target=end, weight='weight') #ovo je samo duzina puta, tj broj grana
    min_cost = sum(matrica[x][y] if matrica[x][y] > 0 else 0 for (x,y) in path) #cijena puta
except nx.NetworkXNoPath:
    min_cost = sys.maxsize

for i in range(n):
    for j in range(m):
        if matrica[i][j] == -2:
            #maknemo zid
            matrica[i][j] = 0

            for k in range(8):
                x = dx[k] + i
                y = dy[k] + j
                if 0 <= x < n and 0 <= y < m and matrica[x][y] != -2: #prolazimo susjedima zida
                   g.add_edge((i, j), (x, y), weight = matrica[x][y])
                   g.add_edge((x, y), (i, j), weight = 0)

            try:
                najkraci_sa_rusenjem = nx.dijkstra_path(g, start, end, weight='weight')
                najkraci_sa_rusenjem_cijena = sum(matrica[x][y] if matrica[x][y] > 0 else 0 for x,y in najkraci_sa_rusenjem)
            except nx.NetworkXNoPath:
                najkraci_sa_rusenjem = sys.maxsize
                                
            min_cost = min(min_cost, najkraci_sa_rusenjem_cijena)
            
            #vratimo zid
            matrica[i][j] = -2
            for k in range(8):
                x = i + dx[k]
                y = j + dy[k]
                if 0 <= x < n and 0 <= y < m and matrica[x][y] != -2: #maknemo grane koje su postojale izmedju zida i njemu susjednih polja
                    g.remove_edge((i, j), (x, y))

if min_cost == sys.maxsize:
    print("Nema puta izmedju ", start, " i ", end)
else:
    print("Put sa najmanjom cijenom od ", start, " do ", end, " je ", min_cost)
