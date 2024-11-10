import axios from 'axios';

export const getLocationAddress = async (lat:number, lng:number) => {
  const apiKey = 'cpTfQT0Od8CV5HYMUuQko9s4mAPpMqPowVSchQ8A14XItk4u0YxYhk2G66DnJZcO';
  const url = `https://api-v2.distancematrix.ai/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const result = response.data.result;

    if (result && result.length > 0) {
      const addressComponents = result[0].address_components;

      const street = addressComponents.find(comp => comp.types.includes('route'))?.long_name || 'Rua não encontrada';
      const city = addressComponents.find(comp => comp.types.includes('administrative_area_level_3'))?.long_name || 'Cidade não encontrada';
      const state = addressComponents.find(comp => comp.types.includes('administrative_area_level_1'))?.long_name || 'Estado não encontrado';

      return `${street}\n${city} - ${state}`;
    } else {
      console.log(lat, lng)
      return 'Endereço não encontrado';
    }
  } catch (error) {
    console.error(error);
    return 'Erro ao buscar endereço';
  }
};
