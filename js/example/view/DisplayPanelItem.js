
/************************************************
*		DisplayPanelItem		*
*************************************************
*
* Entity that displays one item for the DisplayPanel
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
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  var pattern_0value_1units = require( 'string!EXAMPLE_SIM/pattern_0value_1units' );

  var CORNER_RADIUS = 3;
  
  /**
   * Constructor for the DisplayPanelItem
   * @param {model} simulation model
   * @param string{label} Display label
   * @param number{max_value} max_value is used to determine the size of the display box
   * @param string{units} Units of the parameter that is displayed
   * @param Property{value} value of the parameter to be displayed
   * @param number{scale} any scaling if needs to be done to the valueProperty

   * @constructor
   */


  function DisplayPanelItem( model, label, max_value, units, valueProperty, scale, options ) {

    options = _.extend( {
        xMargin: 10,
        yMargin: 10,
        lineWidth: 3,
	decimals:2,
      },
      options );
 
    Node.call( this , {cursor: 'pointer'});

    var fontOptions = {font: new PhetFont( {  fill: 'black', size: 14 } )};

    var ItemDisplay=new Node();

    var ItemLabel = new Text( label, fontOptions );

    var ItemValue=0;

    var ItemText = new Text( StringUtils.format( pattern_0value_1units, max_value, units ), fontOptions );

    // rectangle that the value is displayed in

    var valueXMargin = 8;
    var valueYMargin = 5;
    var ItemRectangle = new Rectangle( 0, 0, ItemText.width + ( 2 * valueXMargin ), ItemText.height + ( 2 * valueYMargin ), CORNER_RADIUS, CORNER_RADIUS, { fill: 'white', stroke: 'black', lineWidth:1 } );
     
     ItemRectangle.left=ItemLabel.right + 10;
     ItemRectangle.centerY =ItemLabel.centerY;
     ItemText.right=ItemRectangle.right-options.xMargin;
     
     ItemText.text=StringUtils.format( pattern_0value_1units, ItemValue.toFixed(options.decimals), units );
     ItemText.right=ItemRectangle.right-options.xMargin;

     ItemDisplay.addChild(ItemRectangle);
     ItemDisplay.addChild(ItemLabel);
     ItemDisplay.addChild(ItemText);
 
     this.addChild(ItemDisplay);

 
       valueProperty.link( function(val) { 

		ItemValue=val/scale;  //update the value of the variable

		if(model.state!=='bottom')  //do not update update if the carton is at bottom (since the display panel is not visible then)
		{
			ItemText.text=StringUtils.format( pattern_0value_1units, ItemValue.toFixed(options.decimals), units );
			ItemText.right=ItemRectangle.right-options.xMargin;
		}
	} );

       model.stateProperty.link( function( )  //update ItemValue if state changes
	{
	     ItemValue=valueProperty.value/scale;
		if(model.state==='moving')   //update the display only when the object starts moving
		{
			ItemText.text=StringUtils.format( pattern_0value_1units, ItemValue.toFixed(options.decimals), units );
			ItemText.right=ItemRectangle.right-options.xMargin;
		}
	} );

  }

  return inherit( Node, DisplayPanelItem );
} );
