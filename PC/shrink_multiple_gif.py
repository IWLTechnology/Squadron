import os
folder_path = "./input"
try:
	all_entries = os.listdir(folder_path)
	file_names = [entry for entry in all_entries if os.path.isfile(os.path.join(folder_path, entry))]
	print("Shrinking files...")
	for file_name in file_names:
		print(f"Shrinking {file_name}...")
		os.system(f"gifsicle ./input/{file_name} --resize 854x480 > ./output/{file_name}")
		print(f"{file_name} shrunk.")
except FileNotFoundError:
	print(f"Error: The folder '{folder_path}' was not found.")
except Exception as e:
	print(f"An error occurred: {e}")
