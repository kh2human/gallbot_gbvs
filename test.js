const assert = require('assert')
const parser = require('./gusoon/commandParser')



function testCommand(char, command) {
    return parser.parseCommand( char, command )
}

function testCommand2( char, command, expactValue ) {
    assert.strictEqual ( testCommand( char , command ) , expactValue )
}

function testLondrekia(command, expactValue) {
    assert.strictEqual( testCommand("londrekia", command ), expactValue ) 
}

function testHyde( command, expactValue ) {
    assert.strictEqual ( testCommand("hyde", command) , expactValue )
}

function testLinne( command, expactValue ) {
    assert.strictEqual ( testCommand("linne", command) , expactValue )
}

function testWaldstein( command, expactValue ) {
    assert.strictEqual ( testCommand("waldstein", command), expactValue) 
}


function testOrie( command, expactValue ) {
    assert.strictEqual ( testCommand("orie", command), expactValue) 
}



function main() {
    testLondrekia("214AB", "214XB")
    testLondrekia("214CB", "214XB")
    testLondrekia("214BB", "214XX ( Double )")
    testLondrekia("214[A]B", "214XB")
    testLondrekia("214[A]A", "214XX ( Double )")
    testLondrekia("214C[B]", "214X[B]")
    testLondrekia("214[C][C]B", "214XXB")
    testLondrekia("214A[C]C", "214XXX ( Triple )")


    testHyde("236A236C", "236X236C")
    testHyde("236A46C", "236X46C")
    testHyde("236A646C", "236X46C")
    testHyde("214ABA", "214AXX")
    testHyde("214AAB", "214AXX")
    testHyde("214AA", "214AX")
    testHyde("214BBB", "214BXX")
    testHyde("214BB", "214BX")


    testLinne("214AB", "214XB")
    testLinne("214AA", "214XA")
    testLinne("214AC", "214XC")
    testLinne("214BB", "214XB")
    testLinne("214BA", "214XA")
    testLinne("214BC", "214XC")
    testLinne("BCA", "BCX")
    testLinne("BCB", "BCX")
    testLinne("BCC", "BCX")



    testWaldstein("214A4A", "214A4X")
    testWaldstein("214A4B", "214A4X")
    testWaldstein("214A4C", "214A4X")
    testWaldstein("214A4X", "214A4X")
    testWaldstein("214B4A", "214B4X")
    testWaldstein("214B4B", "214B4X")
    testWaldstein("214B4C", "214B4X")
    testWaldstein("214B4X", "214B4X")



    testCommand2("orie", "214A4A", "214X4A")
    testCommand2("orie", "214B4A", "214X4A")



    testCommand2("gordeau", "236B6A6C", "236B6X6X")
    testCommand2("gordeau", "236B6A", "236B6X")
    testCommand2("gordeau", "236A6A", "236A6X")
    testCommand2("gordeau", "236A6A6X", "236A6X6X")


    testCommand2("seth", "214AC", "214XC")
    testCommand2("seth", "214XC", "214XC")
    testCommand2("seth", "214BC", "214XC")
    testCommand2("seth", "214B6C", "214XC")


    testCommand2("hilda", "]A[", "]X[")
    testCommand2("hilda", "]B[", "]X[")
    testCommand2("hilda", "]C[", "]X[")


    testCommand2("nanase", "236AC", "236X6C")
    testCommand2("nanase", "236A5C", "236X6C")
    testCommand2("nanase", "236A6C", "236X6C")


    testCommand2("nanase", "236AB", "236X6B")
    testCommand2("nanase", "236A5B", "236X6B")
    testCommand2("nanase", "236A6B", "236X6B")


}



main() 