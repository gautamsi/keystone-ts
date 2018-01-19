import * as React from 'react';
import { Button } from '../../../admin/client/App/elemental';
import { ImageThumbnail } from '../../components/ImageThumbnail';

export const CloudinaryImagesThumbnail: React.SFC<Props> = ({
	isDeleted,
    imageSourceLarge,
    imageSourceSmall,
    inputName,
    isQueued,
    openLightbox,
    shouldRenderActionButton,
    toggleDelete,
    value,
    ...props
}) => {
    // render icon feedback for intent
    let mask;
    if (isQueued) mask = 'upload';
    else if (isDeleted) mask = 'remove';

    // action button
    const actionButton = (shouldRenderActionButton && !isQueued) ? (
        <Button variant="link" color={isDeleted ? 'default' : 'cancel'} block onClick={toggleDelete}>
            {isDeleted ? 'Undo' : 'Remove'}
        </Button>
    ) : null;

    const input = (!isQueued && !isDeleted && value) ? (
        <input type="hidden" name={inputName} value={JSON.stringify(value)} />
    ) : null;

    // provide gutter for the images
    const imageStyles = {
        float: 'left',
        marginBottom: 10,
        marginRight: 10,
    };

    return (
        <div style={imageStyles}>
            <ImageThumbnail
                component={imageSourceLarge ? 'a' : 'span'}
                href={!!imageSourceLarge && imageSourceLarge}
                onClick={e => !!imageSourceLarge && openLightbox(e)}
                mask={mask}
                target={!!imageSourceLarge && '__blank'}
            >
                <img src={imageSourceSmall} style={{ height: 90 }} />
            </ImageThumbnail>
            {actionButton}
            {input}
        </div>
    );

};

export interface Props {
    imageSourceLarge?: string;
    imageSourceSmall: string;
    isDeleted?: boolean;
    isQueued?: boolean;
    openLightbox: any;
    shouldRenderActionButton?: boolean;
    toggleDelete: any;
    inputName?: any;
    value?: any;
}
