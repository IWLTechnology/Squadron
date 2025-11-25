import os
folder_path = "./input"
try:
	all_entries = os.listdir(folder_path)
	file_names = [entry for entry in all_entries if os.path.isfile(os.path.join(folder_path, entry))]
	print("Pixellating files...")
	for file_name in file_names:
		print(f"Pixellating {file_name}...")
		os.system(f"magick -limit memory 5GB ./input/{file_name} -filter Point -scale 5% -scale 2000% ./output/{file_name}")
		print(f"Pixellated {file_name}.")
except FileNotFoundError:
	print(f"Error: The folder '{folder_path}' was not found.")
except Exception as e:
	print(f"An error occurred: {e}")
