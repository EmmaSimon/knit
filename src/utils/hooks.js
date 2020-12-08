import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export const useLocalStorageRecencyArray = (
  key,
  getTransformedItem = (item) => item
) => {
  const savedValues = JSON.parse(localStorage.getItem(key)) || [];
  const [committedValues, setCommittedValues] = useState(savedValues);

  const handleSaveItem = (item) => {
    let saveItem = item;
    if (!saveItem) {
      return;
    }
    saveItem = getTransformedItem(saveItem);
    const existingIndex = committedValues.findIndex(
      ({ id }) => id === saveItem.id
    );
    if (committedValues[existingIndex] !== saveItem) {
      const nextCommitted =
        existingIndex === -1
          ? [saveItem, ...committedValues]
          : [
              saveItem,
              ...committedValues.slice(0, existingIndex),
              ...committedValues.slice(existingIndex + 1),
            ];
      setCommittedValues(nextCommitted);
      localStorage.setItem(key, JSON.stringify(nextCommitted));
    }
    return saveItem;
  };
  const handleDeleteById = (id) => {
    if (!id) {
      return;
    }
    const existingIndex = committedValues.findIndex(
      (pattern) => id === pattern.id
    );
    if (existingIndex === -1) {
      return;
    }
    const nextCommitted = [
      ...committedValues.slice(0, existingIndex),
      ...committedValues.slice(existingIndex + 1),
    ];
    localStorage.setItem(key, JSON.stringify(nextCommitted));
    setCommittedValues(nextCommitted);
  };
  return [committedValues, handleSaveItem, handleDeleteById];
};

export const useIdSelectable = (selectList, initialSelectedId) => {
  const [selectedId, setSelectedId] = useState(initialSelectedId);

  useEffect(() => {
    if (!selectList.find(({ id }) => id === selectedId)) {
      setSelectedId(null);
    }
  }, [selectedId, selectList]);
  return [selectedId, setSelectedId];
};

export const useIdSelectableLocalStorageRecencyArray = (
  key,
  getTransformedItem = (item) => (item.id ? item : { ...item, id: uuid() })
) => {
  const [
    committedValues,
    handleSaveItem,
    handleDeleteById,
  ] = useLocalStorageRecencyArray(key, getTransformedItem);
  const [selectedId, setSelectedId] = useIdSelectable(committedValues, null);
  const handleSaveAndSelectItem = (item) => {
    const savedItem = handleSaveItem(item);
    setSelectedId(savedItem?.id || null);
    return savedItem;
  };
  const handleDeleteAndDeselectIemById = (id) => {
    if (id === selectedId) {
      setSelectedId(null);
    }
    handleDeleteById(id);
  };

  const selectedValue =
    selectedId && committedValues.find(({ id }) => id === selectedId);

  return [
    selectedValue,
    committedValues,
    handleSaveAndSelectItem,
    handleDeleteAndDeselectIemById,
  ];
};
