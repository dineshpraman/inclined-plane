/*
*********************************************************
*		View for the Example Screen		*
*********************************************************
* Instantiates all nodes to be placed in the screen
* Nodes Placed:  MassNode, BackgroundNode, HeightMeterNode, LengthMeterNode, FrictionSlider  
*
* author:Dinesh
*/
define( function( require ) {
  'use strict';

  // general modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Vector2 = require( 'DOT/Vector2' );
  var OutsideBackgroundNode = require( 'SCENERY_PHET/OutsideBackgroundNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Node = require( 'SCENERY/nodes/Node' );

  // specific modules

  var MassNode = require( 'EXAMPLE_SIM/example/view/MassNode' );
  var TruckNode = require( 'EXAMPLE_SIM/example/view/TruckNode' );
  var ValuesControlPanel = require( 'EXAMPLE_SIM/example/view/ValuesControlPanel' );
  var RampNode= require( 'EXAMPLE_SIM/example/view/RampNode' );
  var GoPauseButton = require( 'EXAMPLE_SIM/example/view/GoPauseButton' );
  var ReadoutArrow = require( 'EXAMPLE_SIM/example/view/ReadoutArrow' );
  var BarGraphBackground = require( 'EXAMPLE_SIM/example/view/BarGraphBackground' );
  var BarGraphForeground = require( 'EXAMPLE_SIM/example/view/BarGraphForeground' );
  var ForceVectors = require( 'EXAMPLE_SIM/example/view/ForceVectors' );
  var DisplayPanel = require( 'EXAMPLE_SIM/example/view/DisplayPanel' );
  var OptionsPanel = require( 'EXAMPLE_SIM/example/view/OptionsPanel' );

//  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );


  /**
   * @param {SimluationModel}  model of the simulation
   * @constructor
   */


  var X_MARGIN=20;  
  var Y_MARGIN=20;


  function ExampleScreenView( model ) {

    var exampleScreenView = this;
    ScreenView.call( exampleScreenView);

    var Mass=model.Mass;
    var Truck=model.Truck;

    var viewProperties = new PropertySet( {
      values: true,  // visibiility of force value in the Force readout arrow
      barGraphVisible: true, // visibility of bargraph
      vectorsVisible: true, // visibiiity of force vectors
    } );


	var skygroundx=this.layoutBounds.centerX;  // skygroundx- centerX of the boundary between sky and ground  
	var skygroundy=this.layoutBounds.centerY*1.2 ; // skygroundy- Y coordinate of the boundary between sky and ground  

	//background (sky & ground)
	exampleScreenView.addChild( new OutsideBackgroundNode( skygroundx, skygroundy, this.layoutBounds.width*2, this.layoutBounds.height, this.layoutBounds.height) );

	//valuesControlPanel contains panels for controlling height, length, friction and weight
	var valuesControlPanel= new ValuesControlPanel(model);
	exampleScreenView.addChild(valuesControlPanel);
	valuesControlPanel.top= skygroundy+Y_MARGIN;
	valuesControlPanel.centerX=skygroundx;

	var truckEdge= skygroundx+75; //Position of the left edge of the truck

	//TruckNode creates the Truck
	var truckNode = new TruckNode(model.Truck, {xMargin: truckEdge, yMargin:skygroundy });  

	//RampNode creates the Truck
	var rampNode = new RampNode(model, {xMargin: truckEdge, yMargin:skygroundy });

	//MassNode creates the Mass
	var massNode= new MassNode( model );

	exampleScreenView.addChild( truckNode );
	exampleScreenView.addChild( rampNode ); 
	exampleScreenView.addChild(massNode);

		
	model.Mass.startLocation= new Vector2( rampNode.left + model.getStartX() , skygroundy - model.getStartY() ); //set intial mass location

	//goPauseButton that starts/pauses the motion of the weight
       var goPauseButton = new GoPauseButton( model );
	this.addChild(goPauseButton);
	goPauseButton.centerX=skygroundx;
	goPauseButton.top=50;
	goPauseButton.scale(0.5);

	model.updateFriction();
	
	
	//ReadOut arrow displays the value of the force applied on mass
    var arrow= new ReadoutArrow('Applied Force', Mass.GForce + Mass.maxFriction, Mass.startLocation, Mass.appliedForceProperty, viewProperties.valuesProperty, { labelPosition: 'side'} );
    arrow.rotateAround(Mass.startLocation,-1*Truck.rampAngle); //rotate the arrow
    this.addChild(arrow);


 // ------------- adding the bargraph background and foreground nodes -------------------
    var barGraph=new Node();

    var barGraphBackground= new BarGraphBackground(viewProperties.barGraphVisibleProperty);
    barGraph.addChild(barGraphBackground);

    var barGraphForeground= new BarGraphForeground(Mass, barGraphBackground, viewProperties.barGraphVisibleProperty, 'svg');
    barGraph.addChild(barGraphForeground);

    this.addChild(barGraph);

    barGraph.top=Y_MARGIN;
    barGraph.left=X_MARGIN;

 //----------------------------------------------------------------------------------------	

	//force Vectors display the direction of all forces acting on the Carton
    var forceVectors=new ForceVectors(model,massNode, viewProperties.vectorsVisibleProperty);
    this.addChild(forceVectors);

// ------------------  Reset button --------------------------------------------------	
    var resetAllButton = new ResetAllButton( { listener: function() { 

	model.reset();
//	model.reset.bind( model );
	exampleScreenView.removeChild(forceVectors);
	forceVectors=new ForceVectors(model,massNode);
	exampleScreenView.addChild(forceVectors);
	displayPanel.visible=false;
	valuesControlPanel.visible=true;

	}
    } );

    this.addChild(resetAllButton);
    resetAllButton.bottom=this.layoutBounds.height-Y_MARGIN;
    resetAllButton.right=this.layoutBounds.width-X_MARGIN;
    resetAllButton.scale(0.75);
 //----------------------------------------------------------------------------------------	

	//DisplayPanels displays the measurements and inputs  

    var displayPanel=new DisplayPanel(model);
    this.addChild(displayPanel);
    displayPanel.visible=false;
    displayPanel.centerX=skygroundx;
    displayPanel.centerY=valuesControlPanel.centerY;


	//optionsPanel displays the visibility options for 
    var optionsPanel=new OptionsPanel(viewProperties);
    this.addChild(optionsPanel);
    optionsPanel.right=this.layoutBounds.width-X_MARGIN;
    optionsPanel.top=Y_MARGIN; 



////******* Property.Link functions ***********************************************************


    // change the actual location of the mass and set the state of the simulation 

    Mass.locationProperty.link( function() {
/*

	if(( Mass.location.distanceXY(rampNode.right,rampNode.top) > Mass.size/2 + 5) && (model.state!== 'top' ))
	{
		if(model.state==='moving')
		{
			forceVectors.visible=true;
			forceVectors.centerX = forceVectors.centerX + Mass.location.x - massNode.centerX;
			forceVectors.centerY = forceVectors.centerY + Mass.location.y - massNode.centerY;
		}
		massNode.centerX = Mass.location.x;
		massNode.centerY = Mass.location.y;
	}
*/

	if(( Mass.location.x - model.getBottomX() < truckNode.left) && (model.state!== 'top' ))  //if the bottom left of the mass has not reached the left edge of the truck 
	{
		if(model.state==='moving')  
		{
		forceVectors.visible=viewProperties.vectorsVisibleProperty.value;
		forceVectors.centerX = forceVectors.centerX + Mass.location.x - massNode.centerX; // update forceVectors position, depending on the displacement of the Mass
		forceVectors.centerY = forceVectors.centerY + Mass.location.y - massNode.centerY;

		}
		massNode.centerX = Mass.location.x; //update location of the massNode
		massNode.centerY = Mass.location.y;
	}
		
	else if ( Mass.location.x < rampNode.right + Mass.size/2 ) // carton is at the top of the ramp & has not yet moved completely inside the truck
	{
		model.state='top';
		massNode.rotation = 0; //make the mass horizontal 
		massNode.centerX = Mass.location.x;
		massNode.centerY= skygroundy - Truck.totalHeight  - Mass.size/2; //position the massNode accurately
		forceVectors.visible=false;
	}

	else // carton has moved completely inside the truck
	{
		model.state='completed';
	}

    });

	//update the start location
    Mass.startLocationProperty.link( function(args) {

	massNode.centerX = Mass.startLocation.x;
	massNode.centerY = Mass.startLocation.y;

    });
	

   Truck.multilink( ['rampAngle','friction'], function ( ) {
	model.updateFriction();
	model.updateGForce();
	Mass.startLocation= new Vector2( rampNode.left + model.getStartX() , skygroundy - model.getStartY() ); 
	var maxForce=Mass.GForce + Mass.maxFriction;
	exampleScreenView.removeChild(arrow);
	arrow= new ReadoutArrow('Applied Force', maxForce, Mass.startLocation, Mass.appliedForceProperty, viewProperties.valuesProperty, { labelPosition: 'side'} );
	arrow.rotateAround(Mass.startLocation,-1*Truck.rampAngle);
	exampleScreenView.addChild(arrow);
   } );

   Mass.weightProperty.link( function( ) {

	Mass.startLocation= new Vector2( rampNode.left + model.getStartX() , skygroundy - model.getStartY() );
	model.updateFriction();
	model.updateGForce();
	var maxForce=Mass.GForce + Mass.maxFriction;
	exampleScreenView.removeChild(arrow);
	arrow= new ReadoutArrow('Applied Force', maxForce, Mass.startLocation, Mass.appliedForceProperty, viewProperties.valuesProperty, { labelPosition: 'side'} );
	arrow.rotateAround(Mass.startLocation,-1*Truck.rampAngle);
	exampleScreenView.addChild(arrow);
    } );

   Mass.appliedForceProperty.link( function ( ) {

	goPauseButton.visible= (Mass.appliedForce >= Mass.maxFriction + Mass.GForce) && ( Mass.GForce !== 0); //make the button visible only when the appliedForce is at limit
//	model.running= (Mass.appliedForce >= Mass.maxFriction + Mass.GForce) && ( Mass.GForce !== 0);
   } );

   model.runningProperty.link( function ( ) {
	
	if((model.state==='bottom')&&(model.running=== true))
	{
		arrow.visible=false;
		Mass.location=Mass.startLocation;
		valuesControlPanel.visible=false;
		displayPanel.visible=true;
		model.state='moving';

	}

   } );


////***************************************************************************************************		


  }

  return inherit( ScreenView, ExampleScreenView );

} );


