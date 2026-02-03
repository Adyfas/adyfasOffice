interface expiredLocalstorage {
  key: string;
  value: string;
}

interface removeLocalstorage {
  key: string;
}

export const setExpiredLocalstorage = ({ key, value }: expiredLocalstorage) => {
  const ttl = 360000 * 2;
  const now: Date = new Date(Date.now());
const item = {
  value,
  expiry: now.getTime() + ttl,
};

return localStorage.setItem(key, JSON.stringify(item));
};

export const setRemoveLocalstorage = ({ key }: removeLocalstorage) => {
  const Rawitem = localStorage.getItem(key);
  if (!Rawitem) {
    return null;
  }

  try {
    const item = JSON.parse(Rawitem);
    const now: Date = new Date(Date.now());
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return;
    }
  } catch (error) {
    localStorage.removeItem(key);
    return;
  }
};
