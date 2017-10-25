##Non hash table dictionary implementation

class myDict:
	def __init__(self):
		self.bucketList = [];
		self.keyList = [];
		self.holes = [];

	def addPair(self, key, data):
		if not self.getValue(key):
			if self.holes:
				hole = self.holes.pop() #If there's holes in our data, fill them 
				self.keyList[hole] = key
				self.bucketList[hole] = data
			else:
				self.keyList.append(key)
				self.bucketList.append(data)

	def removeItem(self, key):
		for i in range(0, len(self.keyList)):
			if key == self.keyList[i]:
				self.keyList[i] = None
				self.holes.append(i)
				return
		return None

	def getValue(self, key):
		for i in range(0, len(self.keyList)):
			if key == self.keyList[i]:
				return self.bucketList[i]
		return None

	def printSelf(self):
		for i in range(0, len(self.keyList)):
			if self.keyList[i]:
				printKey = self.keyList[i]
			else: printKey = 'None'
			print("Key: " + printKey + "\nValue: " + self.bucketList[i])
		print('Holes at: ', self.holes)



t = myDict();
for i in range(0,10):
	t.addPair('test' + str(i),'value' + str(i*.5))

t.removeItem('test3')
t.removeItem('test6')
t.removeItem('test1')

t.addPair('Fill', 'fillValue')
t.addPair('Fill', 'fillValue')
t.addPair('Fill', 'fillValue')

t.printSelf()