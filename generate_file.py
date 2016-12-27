import sys
import random
import string

'''
	Helper script to create a test text file. Takes command-line
	params for the filename and number of lines and generates
	a text file. Each line begins with the line number, contains
	some varying amount of random letters and ends with a sentinel
	character "~", followed by the newline character.
'''

newline = '\n'
min_line_len = 70
max_line_len = 130
filler_char = 'x'
end_sentinel = '~'
len_line = 125


if __name__ == '__main__':
	if len(sys.argv) != 3:
		print "Usage: python generate_file.py [filename] [num_lines]"
	else:	
		try:
			filename = sys.argv[1]
			num_lines = int(sys.argv[2])
			with open(filename, 'w') as f:
				for line_index in range(1, num_lines+1):
					f.write("line " + str(line_index) + ": ")
					for char in range(random.randint(min_line_len, max_line_len)):
						f.write(random.choice(string.letters))
					f.write(end_sentinel)
					f.write(newline)
		except ValueError:
			print "[num_lines] argument must be an integer"


