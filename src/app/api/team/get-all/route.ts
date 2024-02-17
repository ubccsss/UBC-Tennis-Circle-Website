import {contentfulClient} from '@lib';
import {ServerResponse} from '@helpers';
import {TypeTeamSkeleton} from '@types';
import {Asset} from 'contentful';

export const GET = async () => {
  try {
    const res = await contentfulClient.getEntries<TypeTeamSkeleton>({
      content_type: 'team',
      include: 2,
    });

    const team = res.items.map(i => ({
      name: i.fields.name,
      role: i.fields.role,
      headshot: `https:${(i.fields.headshot as Asset)?.fields?.file?.url}`,
    }));

    return ServerResponse.success(team);
  } catch (e) {
    return ServerResponse.serverError();
  }
};
