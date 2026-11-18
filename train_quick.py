# train_quick.py - FIXED for train/validation folders
import pathlib
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint

TRAIN_DIR = pathlib.Path('dataset_balanced/train')
VAL_DIR = pathlib.Path('dataset_balanced/validation')
print(f"Train: {TRAIN_DIR.resolve()}")
print(f"Val: {VAL_DIR.resolve()}")

train_gen = ImageDataGenerator(rescale=1./255, rotation_range=20, horizontal_flip=True, brightness_range=[0.7,1.3]).flow_from_directory(str(TRAIN_DIR), target_size=(224,224), batch_size=32, class_mode='categorical')
val_gen = ImageDataGenerator(rescale=1./255).flow_from_directory(str(VAL_DIR), target_size=(224,224), batch_size=32, class_mode='categorical')

print(f"Classes: {train_gen.class_indices}")

model = load_model('backend/model/waste_model.keras')
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

model.fit(train_gen, validation_data=val_gen, epochs=5, callbacks=[ModelCheckpoint('backend/model/waste_model.keras', save_best_only=True, monitor='val_accuracy')])

loss, acc = model.evaluate(val_gen)
print(f"NEW Val Accuracy: {acc*100:.2f}%")
print("DONE! Restart backend now!")