var gItems = {};
var gTags = {};

function AddItem( $items, text )
{
    $items.append( '<li>' + text + '</li>' );
}

function MakeTagId( tagName ) {
    return tagName.replace(/^#/, '') + '-tag';
};

function UpdateItemVisibility( itemId )
{
    var visible = false;
    jQuery.each( gItems[itemId], function( i, tag ) {
        var tagId = MakeTagId( tag );
        if( $('#' + tagId).attr( 'checked' ) ) visible = true;
    } );
    var $items = $('#items').children();
    $($items[itemId]).attr( 'hidden', !visible );
}

function ShowHideTag( tagName, isVisible ) {
    
    var items = gTags[tagName];
    jQuery.each( items, function( i, itemId ) {
        UpdateItemVisibility( itemId );
    } );
}

function ProcessTags( $items, $tags )
{
    // TODO: this algorithm can be more efficient
    
    // Build list of all tags
    newItems = {};
    newTags = {};
    $items.children().each( function( itemId, itemNode ) {
        var itemTags = $(this).text().match( /#\w*/g );
        if( jQuery.isArray( itemTags ) ) {
            jQuery.each( itemTags, function( i, tag ) {
                if( tag in newTags ) {
                    newTags[tag].push( itemId );
                } else {
                    newTags[tag] = [itemId];
                }
            } );
        }
        newItems[itemId] = itemTags;
    } );;
    
    // Sort alphabetically
    // note: the '#' prefix will not affect the sort since it is always present
    var tagValues = jQuery.map( newTags, function( v, k ) { return k; } );
    tagValues.sort();
    
    // Insert into tags container
    $tags.html( jQuery.map( tagValues, function( k, v ) {
        var tagId = MakeTagId( k );
        var labelId = k + '-label';
        return '<li><input type="checkbox" id="' + tagId + '" checked />' +
               '<label for="' + tagId + '">' + k + '</label></li>';
    } ).join("") );
    
    $tags.find( 'input[type="checkbox"]' ).each( function( i, cbox ) {
        $(cbox).change( function( event ) {
            var tagName = $(this).next().text();
            var isVisible = $(this).attr( 'checked' );
            ShowHideTag( tagName, isVisible );
        } );
    } );
    
    gItems = newItems;
    gTags = newTags;
}

$(document).ready( function() {
    var $itemsContainer = $('#items');
    var $tagsContainer = $('#tags');
    var $newItemForm = $('#newItem');
    var $newText = $('#newText');
    
    $newItemForm.submit( function( event ) {
        event.preventDefault();
        AddItem( $itemsContainer, $newText.val() );
        ProcessTags( $itemsContainer, $tagsContainer );
        $newText.val("");
    } );
} );