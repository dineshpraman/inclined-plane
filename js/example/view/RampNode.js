/*****************************************
*		RampNode		*
*****************************************
 * Node for Ramp. Ramp is constructed and visualized.
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
	var Pattern = require( 'SCENERY/util/Pattern' );
	var Matrix3 = require( 'DOT/Matrix3' );
	var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  //images
	var woodImg = require( 'image!EXAMPLE_SIM/images/wood-texture.jpg' );
	var roughImg = require( 'image!EXAMPLE_SIM/images/rough-small.png' );


  /**
   * Constructor for the Ramp which renders the ramp as a scenery node.
   * @param {Ramp} 
   * @constructor
   */

  function RampNode ( model, options ) {

	var Truck=model.Truck;
	options = _.extend( {
	xMargin: 500,
	yMargin: 200,
	thickness:10,
	l_fric_min:6, //defines min. base length of the small triangle used for friction
	l_fric_max:8, //defines max. base length of the small triangle used for friction
	h_fric_min:1.5, // defines min. height of the small triangle used for friction
	h_fric_max:4,	// defines max. height of the small triangle used for friction
	},
	options );

    // Call the super constructor
	var thisNode = this;
	Node.call( thisNode, {
		cursor: 'pointer'
	});


	function drawShape()  //draw the ramp 
	{
		var x=options.xMargin;
		var y=options.yMargin;
		var b=-1*Truck.baseHeight;
		var h=-1*Truck.rampHeight;
		var l=Truck.rampLength;
		var H=-1*(h+b);
		var L=Math.sqrt(H*H+l*l);
		var delX=options.thickness*L/H;
		var delY=options.thickness*(L/l);

		var rampShape=new Shape()
		.moveTo(x,y+b+h)
		.lineTo(x-l,y)
		.lineTo(x-l+delX,y)
		.lineTo(x,y+b+h+delY);

		var rampPath=new Path( rampShape, 
		{
			fill: new Pattern( woodImg).setTransformMatrix( Matrix3.rotation2( -1*Math.atan(H/l) ).timesMatrix( Matrix3.scale( 0.25 ) ) ),
			stroke: 'black',
			lineWidth: 1,
		});

		var h_fric = (Truck.friction === 0) ? 0 : options.h_fric_min + Truck.friction*(options.h_fric_max - options.h_fric_min);
		var l_fric=options.l_fric_max - Truck.friction*(options.l_fric_max - options.l_fric_min);
		var count=(L/l_fric).toFixed(0);

		var frictionNode=new Node(); 
		var frictionShape=new Shape() //friction triangle
		.moveTo(0,0)
		.lineTo(-1*l_fric/2,-1*h_fric)
		.lineTo(-1*l_fric,0)
		.lineTo(0,0);


		for( var i=0;i<count;i++) //adding many friction triangles for friction layer
		{
			frictionNode.addChild( new Path( frictionShape, {
			x: -1*i*l_fric,
			fill: new Pattern( roughImg).setTransformMatrix( Matrix3.scale( 0.25 ) ),
			lineWidth: 2,
			lineJoin: 'round'
			} ) );
		}

		frictionNode.setRotation(-1*Math.atan(H/l));
		frictionNode.setTranslation(x,y+b+h);

		var rampNode=new Node();
		rampNode.addChild(rampPath);
		rampNode.addChild(frictionNode);
		return rampNode;		
	}

	var ramp=drawShape();
	
	thisNode.addChild( ramp );

	//the ramp is draggable to adjust the totalLength

	thisNode.addInputListener( new SimpleDragHandler(
	{
		// When dragging across it in a mobile device, pick it up
		allowTouchSnag: true,
		
		// Translate on drag events
		translate: function( args ) {
			
		if(model.state==='bottom') //ramp is draggable only if the carton is at the bottom
			{
	
				if( Truck.rampLength - (args.delta.x)/1.00 > Truck.maxLength)
				{
					Truck.rampLength=Truck.maxLength;
				}

				else if( Truck.rampLength - (args.delta.x)/1.00 < Truck.minLength)
				{
					Truck.rampLength=Truck.minLength;
				}
				else
				{
					Truck.rampLength= (Truck.rampLength - (args.delta.x)/1.00).toFixed(0);
				}
			}				
		},
	} ) );

//update properties if any changes occurs

	Truck.rampLengthProperty.link( function() {

		var b=Truck.baseHeight;
		var h=Truck.rampHeight;
		var l=Truck.rampLength;
		thisNode.removeChild(ramp);
		ramp=drawShape();
		thisNode.addChild( ramp);  //redraw the ramp
		Truck.rampAngle= Math.atan((b+h)/l);
	} );

	Truck.rampHeightProperty.link( function() {
		var b=Truck.baseHeight;
		var h=Truck.rampHeight;
		var H=Truck.totalHeight;
		var L=Truck.rampLength/Math.cos(Truck.rampAngle);
		Truck.rampLength=Math.sqrt(L*L-H*H);
	} );

	Truck.frictionProperty.link( function() {

		thisNode.removeChild(ramp);
		ramp=drawShape();
		thisNode.addChild( ramp); //redraw the ramp

	} );


  }
		
return inherit( Node, RampNode );

} );

	
