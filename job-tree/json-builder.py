import json, csv, sys

in_file = sys.argv[1]
out_file = sys.argv[2] if len(sys.argv) > 2 else "data.json"


tree = []

def find_with_name(name, nodes):
	for node in nodes:
		if node["name"] == name: return node
	return None

def add_to_tree(row):
	columns_to_extract = [5, 3, 1, 0]
	current_tree = tree
	for column in columns_to_extract:
		name = row[column]
		if not name: continue
		node = find_with_name(name, current_tree)
		if node is None:
			node = { 'name': name, '_children': [] }
			current_tree.append(node)
		current_tree = node['_children']


print "Building tree from file %s..."%in_file
f = open(in_file, 'rU') # opens the csv file
try:
    reader = csv.reader(f, delimiter=';', quoting=csv.QUOTE_MINIMAL)  # creates the reader object
    next(reader) # Skip first line
    for row in reader:   # iterates the rows of the file in orders
        add_to_tree(row)
finally:
    f.close()      # closing



## Write to file
print "Writing json to file %s..."%out_file
f = open(out_file,"w")
f.write( json.dumps( [{ 'name': 'Jobs', 'children': tree }], indent=4) )
f.close()