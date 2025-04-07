'use server';

import { Client } from '@googlemaps/google-maps-services-js';
import { env } from '~/env';

const client = new Client();

const { GOOGLE_API_KEY } = env;

export async function getPredictions(query: string) {
  const response = await client.placeAutocomplete({
    params: {
      input: query,
      key: GOOGLE_API_KEY,
      components: ['country:uk']
    }
  });
  console.log(response);
  return response.data.predictions.map(prediction => ({
    label: prediction.description,
    value: prediction.place_id
  }));
}
