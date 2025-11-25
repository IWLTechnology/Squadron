import os
folder_path = "./input"
try:
	all_entries = os.listdir(folder_path)
	file_names = [entry for entry in all_entries if os.path.isfile(os.path.join(folder_path, entry))]
	print("Pixellating PNG files...")
	for file_name in file_names:
		print(f"Pixellating {file_name}...")
		os.system(f"convert ./input/{file_name} -scale 5% -scale 2000% ./output/{file_name}.gif")
		print(f"Pixellated {file_name}.")
except FileNotFoundError:
	print(f"Error: The folder '{folder_path}' was not found.")
except Exception as e:
	print(f"An error occurred: {e}")
