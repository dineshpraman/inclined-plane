/*
*****************************************
*		View for the Mass	*
*****************************************
* Creates the Mass Node, adds Image(crate.png), defines drag events,
* author:Dinesh
*/

define( function( require ) {
  'use strict';

  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );


//  var Dimension2 = require( 'DOT/Dimension2' );
//  var Vector2 = require( 'DOT/Vector2' );

  // images

  var CrateImg = require( 'image!EXAMPLE_SIM/crate.png' );

  /**
   * Constructor for the MassNode which renders the Mass as a scenery node.
   * @param {Mass} model of the mass
   * @constructor
   */

  function MassNode( model ) {

    var Mass=model.Mass;
    var Truck=model.Truck;
    var massNode = this;

    Node.call( massNode , {cursor: 'pointer'});

    var img = new Image( CrateImg );
    var ImgWidth=img.getBounds().maxX-img.getBounds().minX;

    this.addChild(img);
    img.scale(Mass.size/ImgWidth); // set width of the box to Mass.size
  
    Mass.weightProperty.link( function( weight ) {
	var newSize=(Mass.sizeRange.max-Mass.sizeRange.min)*(weight-Mass.massRange.min)/(Mass.massRange.max-Mass.massRange.min) + Mass.sizeRange.min;  //linear relation for scaling
	massNode.scale(newSize/Mass.size);
	Mass.size=newSize;
    } );


   massNode.addInputListener( new SimpleDragHandler(
      {
        // When dragging across it in a mobile device, pick it up
        allowTouchSnag: true,

        // Translate on drag events
        translate: function( args ) { //increase the applied force as dragged

//		Mass.appliedForce=Mass.appliedForce + args.delta.x;

		args.delta.x=args.delta.x/15; //scaling the distance moved to force

		if( Mass.appliedForce+args.delta.x > Mass.maxFriction + Mass.GForce )
		{
			Mass.appliedForce=Mass.maxFriction + Mass.GForce;
		}
		
		else if( Mass.appliedForce + args.delta.x < 0 )
		{
			Mass.appliedForce=0;
		}
		else
		{
			Mass.appliedForce= Mass.appliedForce + args.delta.x;
		}		

        },

	end: function(args) {

		if(model.running===true)   //clicking on the carton pauses the motion
		{
			model.running=false;
		}

		else if( Mass.appliedForce >= Mass.maxFriction + Mass.GForce)
		{	
			model.running=true;
		}
		
	}

      } ) );

   Mass.orientationProperty.link( function () {

	massNode.rotation = Mass.orientation;

	} );
	
    Truck.rampAngleProperty.link( function() {
	Mass.orientation = -1*Truck.rampAngle;
	} ) ;


} 

  return inherit( Node, MassNode );

});


