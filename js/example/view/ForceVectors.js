/*
*****************************************
*		Force Vectors		*
*****************************************
* Displays the force arrows (weight, applied force, friction force, normal force)
*
* author:Dinesh
*/

define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );

  var error=4;


  function ForceVectors( model, massNode, vectorsVisibleProperty) {

    var Mass=model.Mass;
    var Truck=model.Truck;
    var forceVectors = this;
    var fontOptions = {font: new PhetFont( { size: 10 } )};

    Node.call( forceVectors , {cursor: 'pointer'});
    var NormalArrow=new Node(); 

//labels

    var FrictionLabel = new Text( 'Friction', fontOptions );
    var ForceLabel = new Text( 'Applied Force', fontOptions );
    var NormalForceLabel = new Text( 'Normal Force', fontOptions );
    var WeightLabel = new Text( 'Weight', fontOptions );



// --------    NESTED FUNCTION THAT UPDATES THE ORIENTATION, SIZE OF THE VECTORS -----------------------------

	function updateVectors() {

		var start=Mass.startLocation;
		var offset=Mass.size/2+error;

		var ForceArrow = new ArrowNode(start.x+offset,start.y,start.x+offset+Mass.size,start.y,{fill:'green'});
		var FrictionArrow = new ArrowNode(start.x-offset,start.y,start.x-offset-Mass.size,start.y,{fill:'red'});
		var NormalForceArrow = new ArrowNode(start.x,start.y-offset,start.x,start.y-offset-Mass.size);
		var GravityArrow = new ArrowNode(start.x,start.y,start.x,start.y+Mass.size);

		//add arrows to normal arrow node

		NormalArrow.addChild(FrictionArrow);
		NormalArrow.addChild(ForceArrow);
		NormalArrow.addChild(NormalForceArrow);

		//add labels

		NormalArrow.addChild(ForceLabel);
		NormalArrow.addChild(FrictionLabel);
		NormalArrow.addChild(NormalForceLabel);
		forceVectors.addChild(WeightLabel);

		//label positions

		ForceLabel.left=ForceArrow.left;
		ForceLabel.bottom=ForceArrow.top-3;

		FrictionLabel.centerX=FrictionArrow.centerX;
		FrictionLabel.bottom=FrictionArrow.top-3;

		NormalForceLabel.centerY=NormalForceArrow.centerY;
		NormalForceLabel.left=NormalForceArrow.right+3;

		WeightLabel.centerY=GravityArrow.bottom;
		WeightLabel.left=GravityArrow.right+3;


		// add gravity arrow and normal arrow node

		forceVectors.addChild(NormalArrow);
		forceVectors.addChild(GravityArrow);

		NormalArrow.rotateAround(start,-Truck.rampAngle);
	}
//------------------------------------------------------------------------------------------------------------

    updateVectors();

   this.visible=false; // not visible by default


	//update the force vectors if the start location changes
    Mass.startLocationProperty.link( function(args) {

    //remove all nodes
	
	while(NormalArrow.getChildren()[0])
	{
		NormalArrow.removeChild(NormalArrow.getChildren()[0]);
	}

	NormalArrow=new Node();

	while(forceVectors.getChildren()[0])
	{
		forceVectors.removeChild(forceVectors.getChildren()[0]);
	}

    // update the vectors
	
	updateVectors();

    } );

/*
    model.runningProperty.link( function(args) {

    //remove all nodes
	
	while(NormalArrow.getChildren()[0])
	{
		NormalArrow.removeChild(NormalArrow.getChildren()[0]);
	}

	NormalArrow=new Node();

	while(forceVectors.getChildren()[0])
	{
		forceVectors.removeChild(forceVectors.getChildren()[0]);
	}

    // update the vectors
	
	updateVectors();
    } );
*/

} 

  return inherit( Node, ForceVectors);

});


