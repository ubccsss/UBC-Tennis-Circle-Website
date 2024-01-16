import {NextResponse} from 'next/server';
import {SafeParseError} from 'zod';
import {redirect as nextRedirect} from 'next/navigation';

export class ServerResponse {
  public static serverError(message = 'an unexpected error has occurred') {
    return NextResponse.json({message}, {status: 500});
  }

  public static unauthorizedError(
    message = 'you must be authenticated before you can make this request'
  ) {
    return NextResponse.json({message}, {status: 401});
  }

  public static userError(message: string) {
    return NextResponse.json({message}, {status: 400});
  }

  public static success(data: string | object) {
    if (typeof data === 'string') {
      return NextResponse.json({message: data}, {status: 200});
    }
    return NextResponse.json(data, {status: 200});
  }

  // accepts zod schema object
  public static validationError(validation: SafeParseError<unknown>) {
    const errList: string[] = [];
    validation.error.issues.map(i => {
      errList.push(i.message);
    });

    const errStr = errList.join(', ');
    return NextResponse.json({message: errStr}, {status: 422});
  }

  public static redirect(url: string) {
    nextRedirect(url);
  }
}
