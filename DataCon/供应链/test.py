import json
import datetime
from py2neo import Graph, Node, Relationship, NodeMatcher, RelationshipMatcher
graph = Graph("bolt://127.0.0.1:5052",auth=("neo4j","a2-RIG-voided5."))
tx  = graph.begin()          # Transaction

def read_neo4j(software,version):
    cy="MATCH (n:Product)-[]-(v:Vulnerability) where n.name='%s' or n.version='%s' RETURN v LIMIT 25" %(software,version)
    datas=graph.run(cy)
    for data in datas:
        print(data['v']['cve'])

def filter_name(line):
    index1 = line.rfind('\\')
    index2 = line.rfind(',')
    return line[index1+1:index2]

def filter_version(line):
    index = line.rfind(',')
    return line[index+1:-1]

if __name__ == '__main__':
    input = open("./sca-1.1.txt", "r")
    output = open("output.txt", "w")
    # lines = input.readlines()
    # for line in lines:
    #     name = filter_name(line)
    #     print(name)
    #     version = filter_version(line)
    #     print(version)
    #     read_neo4j(name, version)
    # zujian = ['zlib',]
    read_neo4j('openssl',"")
    input.close()
    output.close()