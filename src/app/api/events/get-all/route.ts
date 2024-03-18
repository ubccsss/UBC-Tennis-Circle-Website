import {contentfulClient} from '@lib';
import {ServerResponse} from '@helpers';
import {TypeEventSkeleton} from '@types';
import {Asset} from 'contentful';

export const GET = async () => {
  try {
    const res = await contentfulClient.getEntries<TypeEventSkeleton>({
      content_type: 'event',
      include: 2,
    });

    const events = res.items.map(i => ({
      id: i.sys.id,
      name: i.fields.name,
      location: i.fields.location,
      ticket_price: i.fields.ticketPrice,
      date: i.fields.date,
      cover_image: `https:${(i.fields.coverImage as Asset)?.fields?.file?.url}`,
      description: i.fields.description,
    }));

    return ServerResponse.success(events);
  } catch (e) {
    return ServerResponse.serverError();
  }
};
