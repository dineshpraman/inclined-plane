
/************************************************
*		DisplayPanel			*
*************************************************
*
* Displays Inputs and measurements panels
*
* author: Dinesh
*/

define( function( require ) {
  'use strict';

  // general modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var AccordionBox = require( 'SUN/AccordionBox' );


   //specific modules
  var DisplayPanelItem = require( 'EXAMPLE_SIM/example/view/DisplayPanelItem' );

  var CORNER_RADIUS = 3;


/**
   * Constructor for the DisplayPanelItem
   * @param {model} simulation model
   * @param options{ }

   * @constructor
   */

  function DisplayPanel( model, options ) {

    options = _.extend( {
        xMargin: 10,
        yMargin: 10,
        lineWidth: 3
      },
      options );
 
    Node.call( this , {cursor: 'pointer'});

// ----------------    INPUT ELEMENTS    ----------------------

     var WeightDisplay=new DisplayPanelItem(model, 'Weight', 10000, 'N', model.Mass.weightProperty, 1);
     var LengthDisplay=new DisplayPanelItem(model, 'Ramp Length', 10000, 'm', model.Truck.totalLengthProperty, model.Truck.scale);	     
     var HeightDisplay=new DisplayPanelItem(model, 'Ramp Height', 10000, 'm', model.Truck.totalHeightProperty, model.Truck.scale);
     var FrictionDisplay=new DisplayPanelItem(model, 'Friction', 100000, '', model.Truck.frictionProperty, 1);
     var ForceDisplay=new DisplayPanelItem(model, 'Applied Force', 10000, 'N', model.Mass.appliedForceProperty,1);



// ----------------    MEASUREMENT ELEMENTS    ----------------------
     
     var WorkDisplay=new DisplayPanelItem(model, 'Work Done', 10000, 'J', model.Mass.workProperty, model.Truck.scale);
     var EnergyDisplay=new DisplayPanelItem(model, 'Potential Energy', 10000, 'J', model.Mass.potentialEnergyProperty, model.Truck.scale);
     var IdealMA_Display=new DisplayPanelItem(model, 'Ideal MA', 100000, '', model.Truck.idealMAProperty,1);
     var ActualMA_Display=new DisplayPanelItem(model, 'Actual MA', 100000, '', model.Mass.actualMAProperty,1);


  
//adding elements into the Input Node

     var Input=new Node();   	
     Input.addChild(WeightDisplay);
     Input.addChild(HeightDisplay);
     Input.addChild(LengthDisplay);
     Input.addChild(FrictionDisplay);
     Input.addChild(ForceDisplay);

//adding elements into the Measurement Node

     var Measurement=new Node();   	
     Measurement.addChild(WorkDisplay);
     Measurement.addChild(EnergyDisplay);
     Measurement.addChild(IdealMA_Display);
     Measurement.addChild(ActualMA_Display);
	

// ------  Positiononing each item of the Inputs Display panel --------------------------------

      var items=Input.getChildren();

	var maxwidth_1=0;

	for(var i=0;i<items.length;i++) //get maximum width
	{
		if(items[i].right>maxwidth_1) { maxwidth_1 = items[i].right; }
	}

	for(i=0;i<items.length;i++)  //right align each item
	{
		items[i].right=maxwidth_1;
	}
	for(i=1;i<items.length;i++)
	{
		items[i].top=items[i-1].bottom+options.yMargin;
	}


// ------  Positiononing each item of the Inputs Display panel --------------------------------

      items=Measurement.getChildren();

	
	var maxwidth_2=0;

	for(i=0;i<items.length;i++) //get maximum width
	{
		if(items[i].right>maxwidth_2) { maxwidth_2 = items[i].right; }
	}

	for(i=0;i<items.length;i++)  // right align each item 
	{
		items[i].right=maxwidth_2;
	}

	for(i=1;i<items.length;i++)
	{
		items[i].top=items[i-1].bottom+options.yMargin;
	}


// ----------------   Accrodion Box for Inputs -------------------------------------------
	
       this.InputContent = new Node();
       this.InputContent.addChild(Input );

	var InputBox = new AccordionBox( this.InputContent,
      {
        titleNode: new Text( 'Inputs', { fill:'black', font: new PhetFont( { size: 15 , weight: 'bold' } ) } ),
        fill: 'rgb(230,230,230)',
        stroke: 'black',
	lineWidth:2,
	contentXMargin: 25,
	contentYMargin: 20,        
        contentAlign: 'center',
        titleAlign: 'center',
        buttonAlign: 'left',
        scale: 0.75,
        cornerRadius: 10,
        buttonXMargin: 8,
        buttonYMargin: 8,
	showTitleWhenExpanded: true,
      } );

// ----------------   Accrodion Box for Measurements ---------------------------------------

       this.MeasurementContent = new Node();
       this.MeasurementContent.addChild( Measurement );

	var MeasurementBox = new AccordionBox( this.MeasurementContent,
      {
        titleNode: new Text( 'Measurements', { fill:'black', font: new PhetFont( { size: 15 , weight: 'bold' } ) } ),
        fill: 'rgb(230,230,230)',
        stroke: 'black',
	lineWidth:2,
	contentXMargin: 25,
	contentYMargin: 20,        
 	contentAlign: 'center',
        titleAlign: 'center',
        buttonAlign: 'left',
        scale: 0.75,
        cornerRadius: 10,
        buttonXMargin: 8,
        buttonYMargin: 8,
	showTitleWhenExpanded: true,
      } );



    this.addChild( InputBox );
    this.addChild( MeasurementBox );

    //positioning
    MeasurementBox.left=InputBox.right+3*options.xMargin;

  }

  return inherit( Node, DisplayPanel );
} );
