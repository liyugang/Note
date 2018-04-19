console.log('\n--------------------------------------------------------------------------\n');

var s = "数据库";
logs(s.charAt(0));
logs(s.charAt(1));
logs(s.charCodeAt(0));
logs(String.fromCodePoint(0x78, 0x1f680, 0x79));
logs(String.fromCodePoint(0x20BB7));

console.log('\n--------------------------------------------------------------------------\n');

let k = 'dsvsahdkhsdjhsk';
for (let code of k) {
    console.log(code);
}
console.log('charAt(10)', k.charAt(10));
console.log(k.includes('d'), k.startsWith('d'), k.endsWith('s'));
console.log(k.repeat(2));
console.log(k.padStart(100, '123'));

console.log('\n--------------------------------------------------------------------------\n');

console.log(new RegExp(/abc/ig, 'i'));

console.log('\n--------------------------------------------------------------------------\n');

console.log('abc'.match('b'));
console.log('abc'.search('d'));
console.log('abcabc'.replace(/a+/y, '1'));

console.log('\n--------------------------------------------------------------------------\n');

console.log('\n--------------------------------------------------------------------------\n');

console.log('\n--------------------------------------------------------------------------\n');

console.log('\n--------------------------------------------------------------------------\n');

console.log('\n--------------------------------------------------------------------------\n');

function logs(a) {
    console.log(a);
}