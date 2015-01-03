/*****************************************
*		TruckNode		*
*****************************************
 * Node for Truck. Truck is constructed and visualized.
 *
 * @author Dinesh
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  /**
   * Constructor for the TruckNode which renders the Truck as a scenery node.
   * @param {Truck} Truck Object 
   * @constructor
   */
  function TruckNode ( Truck, options ) {

    // Demonstrate a common pattern for specifying options and providing default values.
    options = _.extend( {
        xMargin: 500,
        yMargin: 200,
      },
      options );

    // Call the super constructor
    var thisNode = this;
    Node.call( thisNode);

   function drawShape() //draw the truck shape
   {

	var TruckFigure = new Node();
	var x=options.xMargin;
	var y=options.yMargin;
	var b=-1*Truck.baseHeight;
	var h=-1*Truck.rampHeight;
	var l=Truck.truckLength;

	var truckShape = new Shape()
      .moveTo(x,y+b)
      .lineTo(x,y+b+h)
      .lineTo(x+l,y+b+h)
      .lineTo(x+l,y+b+2*h)
      .lineTo(x+l+l/2,y+b+2*h)
      .lineTo(x+2*l,y+b+h)
      .lineTo(x+2*l+l/3,y+b+h)
      .lineTo(x+2*l+l/3,y+b)
      .lineTo(x,y+b);
	
	
    var truckPath=new Path( truckShape, 
        {
         fill: '#994c00',
	}
     );

	var tyre1= new Circle( -1*b/2, {
	fill: 'black',
	stroke: 'grey',
	lineWidth: 2,
	x: x+2*l, y: y+b/2 ,
	} );

	var tyre2= new Circle( -1*b/2, {
	fill: 'black',
	stroke: 'grey',
	lineWidth: 2,
	x: x+l/2, y: y+b/2 ,
	} );	
 
	TruckFigure.addChild(truckPath);
	TruckFigure.addChild(tyre1);
	TruckFigure.addChild(tyre2);
	return TruckFigure;


   }

    var truckPicture=drawShape();

    thisNode.addChild( truckPicture );

    Truck.rampHeightProperty.link( function() { //update the truck

	thisNode.removeChild(truckPicture);
	truckPicture=drawShape();
	thisNode.addChild( truckPicture);

   } );


	
}
  return inherit( Node, TruckNode );
} );
