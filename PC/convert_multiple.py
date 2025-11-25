import os
folder_path = "./input"
try:
	all_entries = os.listdir(folder_path)
	file_names = [entry for entry in all_entries if os.path.isfile(os.path.join(folder_path, entry))]
	print("Converting files...")
	for file_name in file_names:
		print(f"Converting {file_name}...")
		os.system(f"python convert.py ./input/{file_name} ./output/{file_name}.gif")
		print(f"Converted {file_name}.")
except FileNotFoundError:
	print(f"Error: The folder '{folder_path}' was not found.")
except Exception as e:
	print(f"An error occurred: {e}")
