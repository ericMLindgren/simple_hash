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
		insert: (key, value) => {
			let baseIndex = hash(key) % length;
			let bucketIndex
			let i = 0;

			while (i < array.length) {
				bucketIndex = morph(baseIndex, i, length)
				if (!array[bucketIndex] || array[bucketIndex].data == 'TOMBSTONE') {					
					array[bucketIndex] = {data: [key,value], refCount: 0};
					// array[bucketIndex].refCount = 0;
					break
				}

				if (!array[bucketIndex].refCount)
					array[bucketIndex].refCount = 1;
				else 
					array[bucketIndex].refCount++; 


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
					return array[bucketIndex].data[1]
				}
				i++	
			}
		},

		delete: (key) => {
			let baseIndex = hash(key) % length;
			let nextIndex
			let bucketIndex

			let i = 0;
			let deleted

			while (i < array.length) {
				bucketIndex = morph(baseIndex, i, length)
				if (array[bucketIndex].data==undefined) {
					return null
				} else if (array[bucketIndex].data[0]==key) {
					
					deleted = array[bucketIndex];

					if (array[bucketIndex].refCount==0){
						array[bucketIndex].data = undefined;
					}
					else{
						array[bucketIndex].data = 'TOMBSTONE';
						array[bucketIndex].refCount = deleted.refCount;
					}

					while (i > 0) {
						i--;
						bucketIndex = morph(baseIndex, i, length);
						array[bucketIndex].refCount--;

						if (array[bucketIndex].data=='TOMBSTONE' && array[bucketIndex].refCount == 0) {
							array[bucketIndex].data=undefined;
						}
					}

					return deleted;
					
				}

				i++
			}
		},

		print: () => {
			console.log(array);

		}
	}
}

const map = new Hashmap(5);

map.insert('dog','money');
map.insert('thai','curry');
map.insert('boo','hooo');

// map.print()
map.delete('dog')
map.delete('boo')

map.print()