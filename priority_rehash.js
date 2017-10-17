//Quadratic Probing Hashmap in Node

const hash = require('string-hash');

/*
// make an array and keep track of length
// implement insert
// insert needs to:

1. hash the key
2. modulo the hash result
3. check if the index is empty
4. if empty store value
5. if not empty apply quadratic magic

// search needs to:

1. hash the key
2. modulo
3. looks at the value and checks key
4. if key is target, then return value
5. if not do quadratic magic until you find key or null

// delete needs to:
1. hash key
2. modul
3. look at value and check key
4. if key is target, then fill bucket with tombstone if next isn't null, otherwise fill with null



quad (hash + C1*i + C2*i*i)
*/

const Hashmap = function (length) {

	const array = new Array(length);

	
	const C1 = 5, C2 = 3;
	
	function morph(baseIndex, i, length){
		return (baseIndex + (C1 * i) + (C2 * i * i)) % length;
	}

	return {
		rehash: () => {
			let newMap = new Hashmap(length);
			let oldMap = array.slice(0);

			//build a list ordered by accessCount
			oldMap.sort((a, b)=>{
				if (a.accessCount<b.accessCount)
					return 1;
				if (a.accessCount>b.accessCount)
					return -1;
				return 0;
			})


			for (let i in oldMap){
				if (oldMap[i] && (oldMap[i].data != 'TOMBSTONE')){
					newMap.insert(oldMap[i].data[0],oldMap[i].data[1])
				}
			}

			return newMap;
		},

		insert: (key, value) => {
			let baseIndex = hash(key) % length;
			let bucketIndex
			let i = 0;

			while (i < array.length) {
				bucketIndex = morph(baseIndex, i, length)
				if (!array[bucketIndex] || array[bucketIndex].data == 'TOMBSTONE') {					
					array[bucketIndex] = {data: [key,value], accessCount: 0};
					break
				}

				console.log(key, 'collided with ', array[bucketIndex]);
				i++	
			}
		},

		search: (key) => {
			let baseIndex = hash(key) % length;
			let bucketIndex

			let i = 0;

			while (i < array.length) {
				bucketIndex = morph(baseIndex, i, length)
				if (array[bucketIndex].data==undefined){
					return null;
				}

				if (array[bucketIndex].data[0]==key) {
					array[bucketIndex].accessCount++;					
					return array[bucketIndex].data[1];
				}
				i++	
			}
		},

		delete: (key) => {
			let baseIndex = hash(key) % length;
			let bucketIndex

			let i = 0;
			let deleted

			while (i < array.length) {
				bucketIndex = morph(baseIndex, i, length)
				if (array[bucketIndex].data==undefined) {
					return null
				} else if (array[bucketIndex].data[0]==key) {
					
					deleted = array[bucketIndex];

					array[bucketIndex].data = 'TOMBSTONE';
					
					return deleted;
				}
				i++
			}
		}, 

		print: () => {

			console.log('\nHuman Readable Map: \n', array);

		}
	}
}







const map = new Hashmap(5);

map.insert('dog','money');
map.insert('thai','curry');
map.insert('boo','hooo');

// map.print()
map.search('dog')
map.search('dog')
map.delete('dog')
map.delete('boo')

map.insert('dog','hooo');
map.insert('boo','hooo');
map.search('boo')
map.search('boo')
map.search('boo')

map.print()

//priority_rehash(map.clone()).print()
map.rehash().print()

map.print();