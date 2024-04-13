async function getBase64ImageFromURL(url: string): Promise<string> {
    const proxyUrl = 'http://localhost:5000/proxy?url=' + encodeURIComponent(url);
    const response = await fetch(proxyUrl);
    const blob = await response.blob();
    const reader = new FileReader();
  
    return new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

export default getBase64ImageFromURL;