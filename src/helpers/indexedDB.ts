// helpers/indexedDB.ts

export const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open("MyStoriesDB", 1);

    openRequest.onerror = () => reject(openRequest.error);
    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;
      if (!db.objectStoreNames.contains("stories")) {
        db.createObjectStore("stories", { keyPath: "id" });
      }
    };
    openRequest.onsuccess = () => resolve(openRequest.result);
  });
};

export const getNextIdFromDB = async (): Promise<number> => {
  const db = await openDB();
  const transaction = db.transaction("stories", "readonly");
  const store = transaction.objectStore("stories");

  return new Promise((resolve, reject) => {
    const keysRequest = store.getAllKeys();

    keysRequest.onsuccess = () => {
      const keys: IDBValidKey[] = keysRequest.result;
      const numberKeys = keys.filter(
        (key): key is number => typeof key === "number"
      );
      const maxKey = numberKeys.length > 0 ? Math.max(...numberKeys) : -1;
      resolve(maxKey + 1);
    };
    keysRequest.onerror = () => reject(keysRequest.error);
  });
};

export const assignNewId = async () => {
  const db = await openDB();
  const transaction = db.transaction("stories", "readonly");
  const store = transaction.objectStore("stories");
  const allKeysRequest = store.getAllKeys();

  return new Promise((resolve, reject) => {
    allKeysRequest.onsuccess = () => {
      let keys: any;
      keys = allKeysRequest.result;
      const highestKey = keys.length > 0 ? Math.max(...keys) : 0;
      resolve(highestKey + 1); // Assuming `id` is numeric.
    };
    allKeysRequest.onerror = () => reject(allKeysRequest.error);
  });
};

export const saveOrUpdateStory = async (story: any) => {
  if (!story.id) {
    story.id = await assignNewId(); // Ensure a new id is assigned if missing.
  }
  try {
    await saveStoryToDB(story);
    console.log("Story saved successfully.");
  } catch (error) {
    console.error("Error saving the story:", error);
  }
};

export const saveStoryToDB = async (storyData: any): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction("stories", "readwrite");
  const store = transaction.objectStore("stories");

  return new Promise((resolve, reject) => {
    console.log(storyData);
    const request = store.put(storyData);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const fetchStoriesFromDB = async (): Promise<any[]> => {
  const db = await openDB();
  const transaction = db.transaction("stories", "readonly");
  const stories = transaction.objectStore("stories").getAll();
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve(stories.result);
    transaction.onerror = reject;
  });
};

export const deleteStoryFromDB = async (id: number): Promise<void> => {
  const db = await openDB();
  const transaction = db.transaction("stories", "readwrite");
  const store = transaction.objectStore("stories");

  return new Promise((resolve, reject) => {
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const loadStoryFromDB = async (id: number): Promise<any> => {
  const db = await openDB();
  const transaction = db.transaction("stories", "readonly");
  const store = transaction.objectStore("stories");

  return new Promise((resolve, reject) => {
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
