import json

def convert_tex_to_json(input_path, output_path):
    with open(input_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    picture = [
        line.strip() for line in lines 
        if line.strip() and not line.strip().startswith('%')
    ]
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump({"picture": picture}, f, indent=2)

convert_tex_to_json('ALU_diagram.tex', 'ALU_diagram.json')